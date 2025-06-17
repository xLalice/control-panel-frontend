import { apiClient } from "@/api/api";
import { ActivityLog, EntityReference } from "@/types/sharedTypes";
import { useQuery } from "@tanstack/react-query";



export const useActivitiesData = (entityType: EntityReference) => {
  return useQuery<ActivityLog[], Error>({
    queryKey: ["activities", entityType, entityType.entityId],
    queryFn: async () => {
      if (!entityType.entityId || !entityType) {
        throw new Error("Missing entityId or entityType to fetch activities.");
      }

      let url = "";
      switch (entityType.entityType) {
        case "Lead":
          url = `/leads/${entityType.entityId}/activity-log`;
          break;
        case "Inquiry":
          url = `/inquiries/${entityType.entityId}/activity-log`;
          break;
        case "Client":
          url = `/clients/${entityType.entityId}/activity-log`;
          break;
        default:
          throw new Error(
            `Unsupported entity type for activities: ${entityType}`
          );
      }

      const response = await apiClient.get<ActivityLog[]>(url);
      return response.data;
    },
  });
};
