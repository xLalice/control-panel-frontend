import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/api';
import { ActivityLog } from '@/types/sharedTypes';

interface UseLeadActivitiesOptions {
  leadId: string | null | undefined;
}

export const useLeadActivities = ({ leadId }: UseLeadActivitiesOptions) => {
  return useQuery<ActivityLog[], Error>({ 
    queryKey: ["lead-activities", leadId],
    queryFn: async () => {
      if (!leadId) {
        return [];
      }
      const response = await apiClient.get<ActivityLog[]>(`/leads/${leadId}/activities`);
      return response.data;
    },
    enabled: !!leadId,
  });
};