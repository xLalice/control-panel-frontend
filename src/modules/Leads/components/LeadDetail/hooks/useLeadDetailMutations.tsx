import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/api/api";
import { Lead } from "@/modules/Leads/types/leads.types";

interface DeleteLeadPayload {
  leadId: string;
}

interface UpdateStatusPayload {
  leadId: string;
  newStatus: string;
  oldStatus?: string;
  leadName?: string;
}

interface AssignLeadPayload {
  leadId: string;
  assignedToId: string | null;
}

interface LeadMutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage: string | ((data: TData, variables: TVariables) => string);
  errorMessage: string;
  queryKeysToInvalidate?: (variables: TVariables) => string[][];
  onSuccess?: (data: TData, variables: TVariables) => void;
}

const useLeadMutation = <TData = any, TVariables = any>(
  config: LeadMutationConfig<TData, TVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: config.mutationFn,
    onSuccess: (data, variables) => {
      if (config.queryKeysToInvalidate) {
        const keysToInvalidate = config.queryKeysToInvalidate(variables);
        keysToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      // Show success message
      const message =
        typeof config.successMessage === "function"
          ? config.successMessage(data, variables)
          : config.successMessage;
      toast.success(message);

      // Custom success handler
      config.onSuccess?.(data, variables);
    },
    onError: (error) => {
      console.error("Lead mutation error:", error);
      toast.error(config.errorMessage);
    },
  });
};

// Delete Lead Hook
export const useDeleteLead = () =>
  useLeadMutation<any, DeleteLeadPayload>({
    mutationFn: async ({ leadId }) => {
      if (!leadId) throw new Error("Lead ID is required for deletion.");
      const response = await apiClient.delete(`/leads/${leadId}`);
      return response.data;
    },
    successMessage: "Lead deleted successfully",
    errorMessage: "Failed to delete lead. Please try again.",
    queryKeysToInvalidate: (variables) => [
      ["leads"],
      ["lead", variables.leadId],
      ["lead-activities", variables.leadId],
    ],
  });

export const useUpdateLeadStatus = () =>
  useLeadMutation<Lead, UpdateStatusPayload>({
    mutationFn: async ({ leadId, newStatus }) => {
      const response = await apiClient.patch<Lead>(`/leads/${leadId}/status`, {
        status: newStatus,
      });
      return response.data;
    },
    successMessage: (_, variables) => {
      const { oldStatus, newStatus, leadName } = variables;
      if (oldStatus !== "Won" && newStatus === "Won") {
        return `Lead "${leadName || "Unknown"}" converted to Won!`;
      }
      return "Lead status updated successfully";
    },
    errorMessage: "Failed to update lead status. Please try again.",
    queryKeysToInvalidate: (variables) => [
      ["leads"],
      ["lead", variables.leadId],
      ["lead-activities", variables.leadId],
    ],
    onSuccess: (_, variables) => {
      const { oldStatus, newStatus } = variables;
      if (oldStatus !== "Won" && newStatus === "Won") {
        setTimeout(() => {
          toast.success("Lead status updated successfully");
        }, 100);
      }
    },
  });

export const useAssignLead = () =>
  useLeadMutation<any, AssignLeadPayload>({
    mutationFn: async ({ leadId, assignedToId }) => {
      const response = await apiClient.post(`/leads/${leadId}/assign`, {
        assignedToId,
      });
      return response.data;
    },
    successMessage: "Lead assigned successfully",
    errorMessage: "Failed to assign lead. Please try again.",
    queryKeysToInvalidate: (variables) => [
      ["leads"],
      ["lead", variables.leadId],
      ["lead-activities", variables.leadId],
    ],
  });
