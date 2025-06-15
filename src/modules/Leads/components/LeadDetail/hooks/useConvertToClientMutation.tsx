import { apiClient } from "@/api/api";
import { Client } from "@/modules/Clients/clients.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ConvertToClientPayload {
  leadId: string;
}



export const useConvertToClientMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, ConvertToClientPayload>({
    mutationFn: async (payload: ConvertToClientPayload) => {
      const response = await apiClient.post(
        `/leads/convert-to-client/${payload.leadId}`
      );

      console.log("Data: ", response.data)
      return response.data;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inquiries", variables.leadId],
      });

      queryClient.invalidateQueries({ queryKey: ["leads"] });

      queryClient.invalidateQueries({ queryKey: ["clients"] });

      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ["clients", data.id] });
      }

      toast.success("Inquiry successfully converted to Lead!");
    },
    onError: () => toast.error("Failed to convert inquiry to lead"),
  });
};
