import { apiClient } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAssociateInquiry = () => {
  const queryClient = useQueryClient();
  const mutationFn = async ({
    id,
    entityId,
    type,
  }: {
    id: string;
    entityId: string;
    type: "client" | "lead";
  }) => {
    const response = await apiClient.post(`/inquiries/${id}/associate`, {
      type: type === "client" ? "client" : "lead",
      entityId
    });
    return response.data;
  };

  return useMutation({
    mutationFn: mutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiries", variables.id] });
      toast.success(`Inquiry associated to ${variables.type} successfully`);
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message);
    },
  });
};
