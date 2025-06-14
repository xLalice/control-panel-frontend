import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { approveInquiry, convertInquiryToLead, fulfillInquiry } from "@/api/api";
import { AxiosError } from "axios";

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

export const useApproveInquiry = () =>
  useInquiryMutation({
    mutationFn: approveInquiry,
    successMessage: "Inquiry approved successfully",
    errorMessage: "Failed to approve inquiry",
  });

export const useFulfillInquiry = () =>
  useInquiryMutation({
    mutationFn: fulfillInquiry,
    successMessage: "Inquiry fulfilled successfully",
    errorMessage: "Failed to fulfill inquiry",
  });

export const useConvertToLead = () => 
  useInquiryMutation({
    mutationFn: convertInquiryToLead,
    successMessage: "Inquiry converted to lead successfully",
    errorMessage: "Failed to conver to lead"
  })