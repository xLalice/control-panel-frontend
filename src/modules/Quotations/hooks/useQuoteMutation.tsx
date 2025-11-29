import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuotationFormData } from "../../Inquiry/inquiry.types";
import { quotesApi } from "../quotes.api";
import { quotationKeys } from "./useQuotesQueries";

export interface QuoteMutationVariables {
  quotationDetails: QuotationFormData;
}

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
    },
  });
};

export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
    },
  });
};

export const useSendQuotation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotesApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists()});
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(id)})
    }
  });
};