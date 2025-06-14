import { useQuery } from "@tanstack/react-query";
import { Product } from "../types";
import { fetchProducts } from "@/api/api";

export const useProduct = () => {
    return  useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: fetchProducts,
      });
}