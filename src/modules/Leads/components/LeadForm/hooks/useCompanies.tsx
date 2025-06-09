import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api";
import { Company } from "@/modules/Leads/types/leads.types";

export const GET_COMPANIES_QUERY_KEY = ["companies"];

export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await apiClient.get("/leads/companies");
  return response.data;
};

export const useCompanies = () => {
  return useQuery<Company[], Error>({
    queryKey: GET_COMPANIES_QUERY_KEY,
    queryFn: fetchCompanies,
    staleTime: 5 * 60 * 1000, 
  });
};