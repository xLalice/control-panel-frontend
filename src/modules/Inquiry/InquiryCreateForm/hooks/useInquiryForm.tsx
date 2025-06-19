import { useForm } from "react-hook-form";
import {
  formSchema,
  InquiryType,
  Priority,
  CreateInquiryDto,
} from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";

export const useInquiryForm = () => {
  const form = useForm<CreateInquiryDto>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      phoneNumber: "",
      email: "",
      isCompany: false,
      companyName: "",
      companyAddress: "",
      inquiryType: InquiryType.PricingRequest,
      deliveryMethod: undefined,
      deliveryLocation: "",
      preferredDate: new Date(),
      referenceSource: undefined,
      priority: Priority.Medium,
      remarks: "",
      relatedLeadId: "",
      items: [{ productId: "", quantity: 1 }]
    },
  });

  return {
    form,
  };
};
