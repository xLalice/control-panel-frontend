import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuotationFormData } from "../../Inquiry/inquiry.types";
import { quotesApi } from "../quotes.api";
import { quotationKeys } from "./useQuotesQueries";
import { QuotationStatus } from "../quotes.types";

export interface QuoteMutationVariables {
  quotationDetails: QuotationFormData;
}

export const useCreateQuotation = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
      onSuccess?.();
    },
    onError: () => onError?.()
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

export const useSendQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quotesApi.send(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(id) });
    }
  });
};

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: {
      id: string;
      data: Partial<QuotationFormData> & { status: QuotationStatus };
    }) => quotesApi.update(id, data),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(variable.id) })
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists()})
    }
  })
}