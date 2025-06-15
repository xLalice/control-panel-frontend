import { apiClient } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface AssignInquiryPayload {
  assignedToId?: string | null;
}

export const useAssignInquiryMutation = (inquiryId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AssignInquiryPayload) => {
      const response = await apiClient.patch(
        `/inquiries/${inquiryId}/assign`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["inquiries"],
        exact: false 
      });
      
      queryClient.setQueriesData(
        { queryKey: ["inquiries"], exact: false },
        (oldData: any) => {
          if (!oldData?.data) return oldData;
          
          const updatedData = oldData.data.map((inquiry: any) => 
            inquiry.id === inquiryId 
              ? { ...inquiry, assignedTo: data.assignedTo, assignedToId: data.assignedToId }
              : inquiry
          );
          
          return {
            ...oldData,
            data: updatedData
          };
        }
      );
      
      queryClient.setQueryData(["inquiry", inquiryId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          assignedTo: data.assignedTo,
          assignedToId: data.assignedToId
        };
      });
      
      toast.success("Inquiry assigned successfully");
    },
    onError: () => {
      toast.error("Error assigning inquiry");
    },
  });
};