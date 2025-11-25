import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuotationFormData } from "../../Inquiry/inquiry.types";
import { quotesApi } from "../quotes.api";

export interface QuoteMutationVariables {
  quotationDetails: QuotationFormData;
}

export const useCreateQuotation = ({
  onSuccess,
  onError
}: {
  onSuccess: () => void,
  onError: () => void
}) => {
  return useMutation<any, Error, QuotationFormData>({
    mutationFn: async (data) => {
      const response = await quotesApi.create(data);
      return response;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Creating quote failed: ", error);
      onError?.();
    }
  })
}

export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};

export const useSendQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotesApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    }
  });
};