import { fetchUsers } from "@/api/api";
import { User } from "@/types/sharedTypes";
import { useQuery } from "@tanstack/react-query";

export const useUsersData =  () => useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetchUsers();
      return response;
    },
  });