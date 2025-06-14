import { useMutation } from "@tanstack/react-query";
import { Inquiry, CreateInquiryDto } from "../../types";
import { createInquiry } from "@/api/api";
import { toast } from "react-toastify";


export const useCreateInquiryMutation = ({onSuccess}: {onSuccess: () => void}) => {
    return useMutation<Inquiry, Error, CreateInquiryDto>({
        mutationFn: createInquiry,
        onSuccess: () => {
          onSuccess()
        },
        onError: (error: Error) => {
          toast.error(`Failed to add inquiry: ${error.message}`);
        },
      });
}