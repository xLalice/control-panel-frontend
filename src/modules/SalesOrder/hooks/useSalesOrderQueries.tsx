import { useQuery } from "@tanstack/react-query"
import { salesOrderApi } from "../salesOrder.api"

export const salesOrderKeys = {
    root: ['quotations'],
    detail: (id: string) => ["quotations", id]
} as const;

export const useSalesOrdersQuery = () => {
    return useQuery({
        queryKey: salesOrderKeys.root,
        queryFn: () => salesOrderApi.fetch(),
    })
};

export const useSalesOrderQuery = (id: string) => {
    return useQuery({
        queryKey: salesOrderKeys.detail(id),
        queryFn: () => salesOrderApi.fetchDetails(id)
    })
}