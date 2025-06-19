
import { useQuery } from "@tanstack/react-query";
import { checkCustomerExists } from "@/api/api";


export const useCheckCustomer = ({
    debouncedEmail,
    debouncedPhoneNumber,
    debouncedCompanyName,
    debouncedClientName
}: {
    debouncedEmail?: string;
    debouncedPhoneNumber?: string,
    debouncedCompanyName?: string;
    debouncedClientName?: string;
}) => {
  

  return useQuery({
    queryKey: [
      "checkCustomer",
      debouncedClientName,
      debouncedEmail,
      debouncedPhoneNumber,
      debouncedCompanyName,
    ],
    queryFn: () =>
      checkCustomerExists({
        email: debouncedEmail,
        phoneNumber: debouncedPhoneNumber,
        companyName: debouncedCompanyName,
        clientName: debouncedClientName
      }),
    enabled: !!(debouncedEmail || debouncedPhoneNumber || debouncedCompanyName),
  });
};
