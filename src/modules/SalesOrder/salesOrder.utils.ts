import { SALES_ORDER_STATUS } from "./salesOrder.schema";

export const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        [SALES_ORDER_STATUS.Pending]: "bg-yellow-100 text-yellow-800",
        [SALES_ORDER_STATUS.Processing]: "bg-blue-100 text-blue-800",
        [SALES_ORDER_STATUS.ReadyForPickup]: "bg-purple-100 text-purple-800",
        [SALES_ORDER_STATUS.OutForDelivery]: "bg-indigo-100 text-indigo-800",
        [SALES_ORDER_STATUS.Completed]: "bg-green-100 text-green-800",
        [SALES_ORDER_STATUS.Cancelled]: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
};