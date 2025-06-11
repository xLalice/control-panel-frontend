import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/api/api";

interface DeleteLeadPayload {
  leadId: string;
}

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, DeleteLeadPayload>({
    mutationFn: async ({ leadId }) => {
      if (!leadId) throw new Error("Lead ID is required for deletion.");
      const response = await apiClient.delete(`/leads/${leadId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", variables.leadId] });
      queryClient.invalidateQueries({
        queryKey: ["lead-activities", variables.leadId],
      });

      toast.success("Lead deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead. Please try again.");
    },
  });
};
