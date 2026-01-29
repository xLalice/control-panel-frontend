import { useQuery } from "@tanstack/react-query"
import { salesOrderApi } from "../salesOrder.api"
import {SalesOrderQueryOptions } from "../salesOrder.schema";



export const salesOrderKeys = {
    root: ['quotations'],
    list: (data: SalesOrderQueryOptions) => ['quotations', data.page, data.sorting, data.filters],
    detail: (id: string) => ["quotations", id]
} as const;

export const useSalesOrdersQuery = (data: SalesOrderQueryOptions) => {
    return useQuery({
        queryKey: salesOrderKeys.list(data),
        queryFn: () => salesOrderApi.fetch(data),
    })
};

export const useSalesOrderQuery = (id: string) => {
    return useQuery({
        queryKey: salesOrderKeys.detail(id),
        queryFn: () => salesOrderApi.fetchDetails(id)
    })
}