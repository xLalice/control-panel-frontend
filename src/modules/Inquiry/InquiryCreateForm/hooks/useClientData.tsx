
import { useQuery } from "@tanstack/react-query";
import { checkCustomerExists } from "@/api/api";


export const useClientData = ({
    debouncedEmail,
    debouncedPhoneNumber,
    debouncedCompanyName
}: {
    debouncedEmail?: string;
    debouncedPhoneNumber: string,
    debouncedCompanyName?: string;
}) => {
  

  return useQuery({
    queryKey: [
      "checkCustomer",
      debouncedEmail,
      debouncedPhoneNumber,
      debouncedCompanyName,
    ],
    queryFn: () =>
      checkCustomerExists({
        email: debouncedEmail,
        phoneNumber: debouncedPhoneNumber,
        companyName: debouncedCompanyName,
      }),
    enabled: !!(debouncedEmail || debouncedPhoneNumber || debouncedCompanyName),
  });
};
