

import { apiClient } from "@/api/api";
import { Client } from "@/modules/Clients/clients.schema";
import { useQuery } from "@tanstack/react-query";



export const useClientData = (searchTerm: string = "") => { 
  return useQuery<Client[], Error>({
    queryKey: ["clients", searchTerm],
    
    refetchOnWindowFocus: false, 

    queryFn: async () => {
      const response = await apiClient.get("/clients", {
        params: {
          search: searchTerm,
        },
      });
      return response.data;
    },
  });
};