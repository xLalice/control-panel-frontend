import { User } from "@/types/sharedTypes";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../user.api";

export const useUsersData =  () => useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await userApi.list();
      return response;
    },
  });