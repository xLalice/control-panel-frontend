import {
    Button,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Separator,
    Badge,
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui";
import {
    MapPin,
    Calendar,
    CheckCircle,
    Package,
    CreditCard,
    FileText
} from "lucide-react";
import { SALES_ORDER_STATUS, SalesOrderItem } from "../salesOrder.schema";
import { useSalesOrderQuery } from "../hooks/useSalesOrderQueries";
import { useUpdateSalesOrderStatus } from "../hooks/useSalesOrderMutations";
import { formatCurrency } from "@/utils/currency";
import { getStatusColor } from "../salesOrder.utils";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface SalesOrderDetailProps {
    orderId: string;
}

export const SalesOrderDetail = ({ orderId }: SalesOrderDetailProps) => {
    const { data: order, isLoading, error } = useSalesOrderQuery(orderId);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateSalesOrderStatus();

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading order details...</div>;
    }

    if (error || !order) {
        return <div className="p-8 text-center text-red-500">Failed to load order details.</div>;
    }

    const handleMarkCompleted = () => {
        updateStatus(
            { id: orderId, status: SALES_ORDER_STATUS.Completed },
            {
                onSuccess: () => toast.success(`Order ${order.orderNumber || orderId.substring(0, 8)} marked as completed!`),
                onError: () => toast.error("Failed to update status"),
            }
        );
    };

    const isCompleted = order.status === SALES_ORDER_STATUS.Completed;
    const isCancelled = order.status === SALES_ORDER_STATUS.Cancelled;

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(order.status)}>
                            {order.status.replace(/([A-Z])/g, " $1").trim()}
                        </Badge>
                    </div>

                    {!isCompleted && !isCancelled && (
                        <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleMarkCompleted}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                            Mark as Delivered
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
                                <p className="font-medium text-base whitespace-pre-wrap">
                                    {order.deliveryAddress || "No address provided (Pickup)"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="pt-4 flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Target Date</p>
                                <p className="font-semibold">
                                    {order.deliveryDate ? format(new Date(order.deliveryDate), "MMM d, yyyy") : "ASAP"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Payment Terms</p>
                                <p className="font-semibold">{order.paymentTerms}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Tabs defaultValue="items" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="items">Items to Fulfill</TabsTrigger>
                    <TabsTrigger value="info">Order Info</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Package className="h-4 w-4" /> Package Contents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item: SalesOrderItem) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.product.name}
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {item.product.sku}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">{item.quantity}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{formatCurrency(item.unitPrice)}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Card className="w-full sm:w-2/3">
                            <CardContent className="pt-6 space-y-2">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total Value</span>
                                    <span>
                                        {formatCurrency(
                                            order.items.reduce((acc: number, item: SalesOrderItem) => acc + Number(item.totalPrice), 0)
                                        )}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="info">
                    <Card>
                        <CardHeader><CardTitle>Additional Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Notes</p>
                                    <p className="text-sm italic">{order.notes || "No notes provided."}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Quote Reference</p>
                                    <p className="font-mono">{order.quoteReference?.quotationNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Order ID</p>
                                    <p className="font-mono text-xs">{order.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};