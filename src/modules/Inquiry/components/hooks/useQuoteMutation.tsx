import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuotationFormData } from "../../types";
import { apiClient } from "@/api/api";

interface QuoteMutationVariables {
  quotationDetails: QuotationFormData;
}

export const useQuoteMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, QuoteMutationVariables>({
    mutationFn: async ({ quotationDetails }) => {
      const response = await apiClient.post(`/quote`, quotationDetails);
      return response.data;
    },
    onSuccess: (_, variables) => { 
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      let entity = variables.quotationDetails.fromEntity;
      if (entity.entityType === "lead") {
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        queryClient.invalidateQueries({ queryKey: ["leads", entity.id] });
      } else if (
        variables.quotationDetails.fromEntity.entityType === "client"
      ) {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.invalidateQueries({ queryKey: ["clients", entity.id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["inquiries"] });
        queryClient.invalidateQueries({
          queryKey: ["inquiries", entity.id],
        });
      }
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Quotation mutation failed:", error);
      onError?.();
    },
  });
};
