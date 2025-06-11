
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/api';
import { Lead } from '@/modules/Leads/types/leads.types';



interface UseLeadDetailsOptions {
  leadId: string | null | undefined;
}

export const useLeadDetails = ({ leadId }: UseLeadDetailsOptions) => {
  return useQuery<Lead, Error>({ 
    queryKey: ["lead", leadId],
    queryFn: async () => {
      if (!leadId) {
        
        throw new Error("Lead ID is required to fetch lead details.");
      }
      const response = await apiClient.get<Lead>(`/leads/${leadId}`);
      return response.data;
    },
    enabled: !!leadId, 
  });
};