import { useMutation } from "@tanstack/react-query"
import { salesOrderApi } from "../salesOrder.api"
import { SalesOrderFormType } from "../salesOrder.schema"

export const useCreateSalesOrder = () => {

    return useMutation({
        mutationFn: (data: SalesOrderFormType) => salesOrderApi.create(data),
    })
}