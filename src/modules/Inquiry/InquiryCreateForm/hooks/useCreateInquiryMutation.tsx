import { useMutation } from "@tanstack/react-query";
import { Inquiry, CreateInquiryDto } from "../../inquiry.types";
import { toast } from "react-toastify";
import { inquiryApi } from "../../inquiry.api";


export const useCreateInquiryMutation = ({onSuccess}: {onSuccess: () => void}) => {
    return useMutation<Inquiry, Error, CreateInquiryDto>({
        mutationFn: inquiryApi.create,
        onSuccess: () => {
          onSuccess()
        },
        onError: (error: Error) => {
          toast.error(`Failed to add inquiry: ${error.message}`);
        },
      });
}