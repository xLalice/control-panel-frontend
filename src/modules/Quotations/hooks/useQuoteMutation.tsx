import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuotationFormData } from "../../Inquiry/inquiry.types";
import { quotesApi } from "../quotes.api";
import { quotationKeys } from "./useQuotesQueries";
import { QuotationStatus } from "../quotes.types";
import { leadKeys } from "@/modules/Leads/lead.keys";
import { SalesOrderFormType } from "@/modules/SalesOrder/salesOrder.schema";

export interface QuoteMutationVariables {
  quotationDetails: QuotationFormData;
}

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotesApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });

      if (variables.leadId) {
        queryClient.invalidateQueries({
          queryKey: ['quotations', 'lead', variables.leadId]
        });
      }
      else if (variables.clientId) {
        queryClient.invalidateQueries({
          queryKey: ['quotations', 'client', variables.clientId]
        });
      }
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
      data: Partial<QuotationFormData> & { status?: QuotationStatus };
    }) => quotesApi.update(id, data),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(variable.id) })
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() })

      const status = variable.data.status;
      if (status === QuotationStatus.Accepted || status === QuotationStatus.Rejected) {
        queryClient.invalidateQueries({queryKey: leadKeys.list()})
      }
    }
  })
}

export const useConvertToSalesOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SalesOrderFormType) => quotesApi.convertToSalesOrder(data),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(variable.quotationId)})
    }
  })
}