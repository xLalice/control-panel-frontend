import { useMutation } from "@tanstack/react-query"
import { salesOrderApi } from "../salesOrder.api"
import { SalesOrderFormType, SalesOrderUpdatePayload } from "../salesOrder.schema"

export const useCreateSalesOrder = () => {
    return useMutation({
        mutationFn: (data: SalesOrderFormType) => salesOrderApi.create(data),
    })
}

export const useUpdateSalesOrderStatus = () => {
    return useMutation({
        mutationFn: (data: SalesOrderUpdatePayload) => salesOrderApi.update(data),
    })
}