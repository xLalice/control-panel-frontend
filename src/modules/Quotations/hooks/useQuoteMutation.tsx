import { useMutation} from "@tanstack/react-query";
import { QuotationFormData } from "../../Inquiry/inquiry.types";
import { quotesApi } from "../quotes.api";

export interface QuoteMutationVariables {
  quotationDetails: QuotationFormData;
}

export const useDraftQuotation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) => {
  return useMutation<any, Error, QuotationFormData>({
    mutationFn: async (data) => {
      const response = await quotesApi.draft(data);
      return response;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Quotation mutation failed:", error);
      onError?.();
    },
  });
};

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
