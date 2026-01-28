import z from "zod";
import { Client } from "../Clients/clients.schema";
import { Product } from "../Products/product.types";

export const convertToSalesOrderPayload = z.object({
    quotationId: z.string(),
    deliveryDate: z.date({
        required_error: "A delivery date is required.",
    }),
    deliveryAddress: z.string().min(5, {
        message: "Delivery address is required (min 5 chars).",
    }),
    paymentTerms: z.string().min(2, {
        message: "Payment terms are required (e.g. COD, 30 Days).",
    }),
    notes: z.string().optional(),
});



export type SalesOrderFormType = z.infer<typeof convertToSalesOrderPayload>;

export const SALES_ORDER_STATUS = {
    Pending: "Pending",
    Processing: "Processing",
    ReadyForPickup: "Ready For Pickup",
    OutForDelivery: "Out For Delivery",
    Completed: "Completed",
    Cancelled: "cancelled",
} as const;

export type SalesOrderStatus = typeof SALES_ORDER_STATUS[keyof typeof SALES_ORDER_STATUS];

export const updateSalesOrderPayload = z.object({
    id: z.string(),
    status: z.nativeEnum(SALES_ORDER_STATUS)
});

export type SalesOrderUpdatePayload = z.infer<typeof updateSalesOrderPayload>

export type SalesOrder = {
    id: string,
    client: Client,
    quoteReferenceId?: string,
    status: SalesOrderStatus,
    items: SalesOrderItem[],

    deliveryDate: Date,
    deliveryAddress?: string,
    paymentTerms: string,
    notes?: string
}

export type SalesOrderItem = {
    id: string;
    salesOrderId: string,
    product: Pick<Product, 'name' | 'sku'>,
    quantity: number,
    unitPrice: number;
    totalPrice: number;
}

export type SalesOrderFilters = {
  search: string;
  status?: SalesOrderStatus;
};