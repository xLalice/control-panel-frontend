import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api"; 
import { ContactHistory, EntityType } from "@/types/sharedTypes";

interface UseContactHistoryDataProps {
  entityId: string | null | undefined;
  entityType: EntityType | null | undefined;
}

export const useContactHistoryData = ({ entityId, entityType }: UseContactHistoryDataProps) => {
  return useQuery<ContactHistory[], Error>({
    queryKey: ['contactHistory', entityType, entityId],
    queryFn: async () => {
      if (!entityId || !entityType) {
        throw new Error("Missing entityId or entityType to fetch contact history.");
      }

      let url = '';
      switch (entityType) {
        case 'Lead':
          url = `/leads/${entityId}/contact-history`;
          break;
        case 'Inquiry':
          url = `/inquiries/${entityId}/contact-history`;
          break;
        case 'Client':
          url = `/clients/${entityId}/contact-history`;
          break;
        default:
          throw new Error(`Unsupported entity type for contact history: ${entityType}`);
      }

      const response = await apiClient.get<ContactHistory[]>(url);
      return response.data;
    },
    enabled: !!entityId && !!entityType,
    refetchOnWindowFocus: false,
  });
};