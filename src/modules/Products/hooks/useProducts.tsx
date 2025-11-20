import { useQuery } from "@tanstack/react-query";
import { Product } from "../types";
import { productsApi } from "../products.api";

export const useProduct = () => {
    return  useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: productsApi.fetch,
      });
}