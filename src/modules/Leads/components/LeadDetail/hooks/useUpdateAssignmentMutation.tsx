import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/api/api";

interface AssignLeadPayload {
  leadId: string;
  assignedToId: string;
}

export const useAssignLead = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AssignLeadPayload>({
    mutationFn: async ({ leadId, assignedToId }) => {
      const response = await apiClient.post(`/leads/${leadId}/assign`, {
        assignedToId,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lead", variables.leadId] });
      queryClient.invalidateQueries({
        queryKey: ["lead-activities", variables.leadId],
      });
      queryClient.invalidateQueries({ queryKey: ["leads"] });

      toast.success("Lead assigned successfully");
    },
    onError: (error) => {
      console.error("Error assigning lead:", error);
      toast.error("Failed to assign lead. Please try again.");
    },
  });
};
