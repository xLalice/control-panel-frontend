import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { inquiryApi } from "@/modules/Inquiry/inquiry.api";

interface MutationConfig {
  mutationFn: (id: string) => Promise<any>;
  successMessage: string;
  errorMessage: string;
  queryKeys?: string[][];
}

interface BackendErrorResponse {
  success: false;
  message: string;
  details?: any;
}

const useInquiryMutation = (config: MutationConfig) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: config.mutationFn,
    onSuccess: () => {
      const keysToInvalidate = config.queryKeys || [["inquiries"]];
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      toast.success(config.successMessage);
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      console.error("Mutation error:", error); 
      console.error("Error response data:", error.response?.data); 

      toast.error(error.message);
    },
  });
};

export const useConvertToLead = () =>
  useInquiryMutation({
    mutationFn: inquiryApi.convertToLead,
    successMessage: "Inquiry converted to lead successfully",
    errorMessage: "Failed to convert to lead",
    queryKeys: [
      ["inquiries"]
    ],
  });

export const useReviewInquiry = () => 
  useInquiryMutation({
    mutationFn: inquiryApi.review,
    successMessage: "Inquiry reviewed successfully",
    errorMessage: "Error changing status in the backend. Contact author"
  })

export const useCloseInquiry = () =>
  useInquiryMutation({
    mutationFn: inquiryApi.close,
    successMessage: "Inquiry closed successfully",
    errorMessage: "Failed to close inquiry."
  })