import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api";
import { Filters, Lead } from "../types/leads.types";
import { SortingState } from "@tanstack/react-table";
import { PAGE_SIZE } from "../constants/constants";
export const useLeadsData = ({
  filters,
  page,
  sorting,
}: {
  filters: Filters;
  page?: number;
  sorting?: SortingState;
}) =>
  useQuery({
    queryKey: ["leads", filters, page, sorting],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);

      params.set("page", (page ?? 1).toString());
      params.set("pageSize", PAGE_SIZE.toString());

      if (sorting && sorting.length > 0) {
        params.set("sortBy", sorting[0].id);
        params.set("sortOrder", sorting[0].desc ? "desc" : "asc");
      }

      const response = await apiClient.get("/leads?" + params.toString());
      return response.data as {
        leads: Lead[];
        total: number;
      };
    },
  });
