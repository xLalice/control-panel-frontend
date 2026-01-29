import { useMutation, useQueryClient } from "@tanstack/react-query"
import { salesOrderApi } from "../salesOrder.api"
import { SalesOrderFormType, SalesOrderUpdatePayload } from "../salesOrder.schema"
import { salesOrderKeys } from "./useSalesOrderQueries"

export const useCreateSalesOrder = () => {
    return useMutation({
        mutationFn: (data: SalesOrderFormType) => salesOrderApi.create(data),
    })
}

export const useUpdateSalesOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SalesOrderUpdatePayload) => salesOrderApi.update(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: salesOrderKeys.root})
    })
}